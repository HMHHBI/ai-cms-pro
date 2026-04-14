<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{
  protected $ticketService;

  public function __construct(TicketService $ticketService)
  {
    $this->ticketService = $ticketService;
  }

  /**
   * Get all tickets for the authenticated user's company.
   */
  public function index(Request $request)
  {
    $user = Auth::user();
    $status = $request->query('status', 'open');
    $mood = $request->query('mood', 'all');
    $search = $request->query('search');

    $query = Ticket::where('company_id', $user->company_id)->where('status', $status);

    if ($mood !== 'all') {
      $query->where('ai_sentiment', $mood);
    }

    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('subject', 'like', "%{$search}%")
          ->orWhere('customer_name', 'like', "%{$search}%")
          ->orWhere('message', 'like', "%{$search}%");
      });
    }

    $tickets = (clone $query)->latest()->get();

    return Inertia::render('Dashboard', [
      'auth' => [
        'user' => Auth::user()->load('company') // ✅ FIX
      ],
      'tickets' => $tickets->append(['priority_color', 'mood', 'created_at_human', 'is_overdue']),
      'filters' => $request->only(['search', 'status', 'mood']),
      'stats' => [
        'total' => (clone $query)->count(),
        'open' => (clone $query)->where('status', 'open')->count(),
        'urgent' => (clone $query)->where('status', 'open')->where('ai_sentiment', 'negative')->count(),
        'resolvedToday' => (clone $query)->where('status', 'closed')->whereDate('updated_at', today())->count(),
      ],
      'staffMembers' => \App\Models\User::where('company_id', $user->company_id)->where('role', 'staff')->get(),
    ]);
  }

  /**
   * Create a new ticket with AI-powered draft.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'subject' => 'required|string|max:255',
      'message' => 'required|string',
    ]);

    try {
      $ticket = $this->ticketService->createTicket(Auth::user(), $validated);

      return redirect()->back()->with('message', 'AI analysis complete! Ticket created.');

    } catch (\Exception $e) {
      return redirect()->back()->withErrors(['error' => 'AI processing failed.']);
    }
  }

  public function assign(Request $request, Ticket $ticket)
  {
    // Sirf admin assign kar sakta hai
    if (Auth::user()->role !== 'admin')
      abort(403);

    $ticket->update(['assigned_to' => $request->staff_id]);
    return back()->with('message', 'Ticket assigned!');
  }

  public function claim(Ticket $ticket)
  {
    // ❌ Gap: Pehle sirf status check ho raha tha shayad
    // ✅ Fix: Check karein ke assigned_to null hai ya nahi
    if ($ticket->assigned_to !== null) {
      return back()->with('error', 'Yeh ticket pehle hi kisi ko assign ho chuka hai!');
    }

    $ticket->update([
      'assigned_to' => Auth::id(),
    ]);

    return back()->with('message', 'Ticket claimed successfully!');
  }

  public function resolve(Request $request, $ticket)
  {
    $ticket = Ticket::findOrFail($ticket);

    try {
      // 1. Check karein kya data aa raha hai?
      Log::info('Resolving Ticket ID: ' . $ticket);
      Log::info('Reply Text: ' . $request->reply);

      // 2. Email bhejne se pehle status update karke dekhein
      // Agar email fail bhi ho, toh kam az kam database update ho jaye (sirf testing ke liye)
      $ticket->update([
        'status' => 'closed',
        'ai_suggestion' => $request->reply
      ]);

      // 3. Email bhejein
      Mail::raw($request->reply, function ($message) use ($ticket) {
        $customerEmail = $ticket->customer_email ?? $ticket->user->email;
        $message->to($customerEmail)->subject('Support Reply');
      });

      return back()->with('message', 'Resolved!');

    } catch (\Exception $e) {
      Log::error('Email Error: ' . $e->getMessage());
      return back()->withErrors(['error' => 'Something went wrong: ' . $e->getMessage()]);
    }
  }

  public function generateInsight()
  {
    $tickets = Ticket::where('company_id', Auth::user()->company_id)->where('status', 'open')->limit(10)->get();

    if ($tickets->isEmpty()) {
      return response()->json(['insight' => "No open tickets to analyze right now. ☕"]);
    }

    $dataSummary = $tickets->pluck('subject')->implode(', ');
    $insight = $this->ticketService->getAiDraft(
      "Manager summary for these tickets: [{$dataSummary}]. Max 15 words, Hinglish tone."
    );

    return response()->json(['insight' => $insight]);
  }

  public function askAi(Request $request)
  {
    $request->validate(['prompt' => 'required|string|max:500']);

    // Gemini Service ko call karein
    $response = $this->ticketService->getAiDraft($request->prompt);

    return response()->json(['response' => $response]);
  }
}