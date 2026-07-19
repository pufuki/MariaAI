'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Send, Sparkles, Trash2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

const suggestions = [
  'Draft a proposal for a 3-month AI chatbot project',
  'Summarize my agency performance this month',
  'Write a cold outreach email for SaaS companies',
  'Suggest pricing tiers for a new retainer client',
];

export default function AiChatPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) setError(error.message);
    else setMessages(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send(content: string) {
    if (!content.trim() || sending) return;
    setSending(true);
    setInput('');

    const { data: userMsg, error: userErr } = await supabase
      .from('chat_messages')
      .insert({ role: 'user', content: content.trim() })
      .select()
      .single();

    if (userErr) {
      toast({ title: 'Failed to send', description: userErr.message, variant: 'destructive' });
      setSending(false);
      return;
    }

    setMessages((prev) => [...prev, userMsg]);

    const responses: Record<string, string> = {
      proposal: 'Here is a draft proposal:\n\n**Project: AI Chatbot Implementation**\n\nScope: Design, build, and deploy a custom AI chatbot integrated with your existing knowledge base.\n\nTimeline: 12 weeks across 3 milestones.\n\nInvestment: $24,000 ($8,000/month)\n\nDeliverables: Chatbot widget, admin dashboard, analytics, and 30-day post-launch support.',
      performance: 'Your agency is performing well this month:\n\n- Revenue: $84,250 (+12.5% MoM)\n- New clients: 3\n- Active projects: 24\n- Team utilization: 87%\n\nTop performer: Nimbus Labs ($12,000 MRR). Watch out for Quantum Foods — invoice is 3 days overdue.',
      email: 'Subject: AI that handles your support tickets while you sleep\n\nHi [Name],\n\nI noticed [Company] is scaling fast — congrats on the recent round!\n\nMost SaaS teams we work with spend 15+ hours/week on repetitive support tickets. We build AI agents that resolve 60% of them automatically.\n\nWorth a 15-minute chat next week?\n\nBest,\n[Your name]',
      pricing: 'Here are suggested retainer tiers:\n\n**Starter — $3,000/mo**: 1 AI agent, basic analytics, email support\n**Growth — $8,000/mo**: Up to 3 agents, custom integrations, priority support\n**Enterprise — $15,000/mo**: Unlimited agents, dedicated manager, SLA, quarterly strategy sessions',
    };

    const lower = content.toLowerCase();
    let response = "I'm your AI agency copilot. I can help you draft proposals, summarize performance, write outreach emails, and suggest pricing. What would you like to work on?";
    if (lower.includes('proposal')) response = responses.proposal;
    else if (lower.includes('performance') || lower.includes('summar')) response = responses.performance;
    else if (lower.includes('email') || lower.includes('outreach')) response = responses.email;
    else if (lower.includes('pricing') || lower.includes('tier')) response = responses.pricing;

    await new Promise((r) => setTimeout(r, 600));

    const { data: aiMsg, error: aiErr } = await supabase
      .from('chat_messages')
      .insert({ role: 'assistant', content: response })
      .select()
      .single();

    if (aiErr) {
      toast({ title: 'AI response failed', description: aiErr.message, variant: 'destructive' });
    } else {
      setMessages((prev) => [...prev, aiMsg]);
    }
    setSending(false);
  }

  async function clearChat() {
    const { error } = await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) toast({ title: 'Clear failed', description: error.message, variant: 'destructive' });
    else { setMessages([]); toast({ title: 'Chat cleared' }); }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Copilot</h1>
            <p className="text-sm text-muted-foreground">Your agency intelligence assistant</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:text-destructive" onClick={clearChat}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <Card className="glass mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border-border/50">
        {loading ? (
          <LoadingState label="Loading conversation…" />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMessages} />
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium">How can I help your agency today?</p>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these suggestions:</p>
            </div>
            <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-border/50 bg-secondary/20 p-3 text-left text-sm transition-all hover:border-primary/30 hover:bg-secondary/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4 lg:p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    msg.role === 'user'
                      ? 'bg-secondary/60 text-muted-foreground'
                      : 'bg-gradient-to-br from-primary to-accent text-white',
                  )}
                >
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm',
                    msg.role === 'user'
                      ? 'bg-secondary/40'
                      : 'glass border-border/50',
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="glass flex items-center gap-1 rounded-2xl px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-border/50 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask your AI copilot anything…"
              className="min-h-[44px] max-h-32 resize-none rounded-xl bg-card/50"
              rows={1}
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl"
              onClick={() => send(input)}
              disabled={sending || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
