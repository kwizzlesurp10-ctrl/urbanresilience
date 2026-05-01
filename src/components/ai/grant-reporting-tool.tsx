'use client';

import React, { useState } from 'react';
import { type GrantReportOutput, type GrantReportInput } from '@/ai/flows/grant-report-generator-flow';
import { formatPostJsonError, postJson } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2, CheckCircle, AlertTriangle, XCircle, FileWarning } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const grantTypes = ["FEMA BRIC", "HUD CDBG-MIT", "EPA Environmental Justice", "State Infrastructure Bank"];

export function GrantReportingTool() {
  const [projectName, setProjectName] = useState('');
  const [grantType, setGrantType] = useState(grantTypes[0]);
  const [fundingRequested, setFundingRequested] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GrantReportOutput | null>(null);

  const handleGenerate = async () => {
    const funding = parseFloat(fundingRequested);
    if (!projectName || !funding || funding < 0.1) return;
    setIsLoading(true);
    try {
      const input: GrantReportInput = {
        projectName,
        grantType: grantType as GrantReportInput['grantType'],
        fundingRequested: funding,
      };
      const outcome = await postJson<GrantReportOutput>('/api/grant-report', input);
      if (!outcome.ok) {
        const msg = formatPostJsonError(outcome.error);
        console.error('Grant report API error', {
          status: outcome.error.status,
          detail: outcome.error.body,
          message: msg,
        });
        toast({
          title: 'Grant report failed',
          description: msg,
          variant: 'destructive',
        });
        return;
      }
      setResult(outcome.data);
    } catch (err) {
      console.error('Report Generation Failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="glass-card border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50"><FileText className="w-16 h-16 text-primary" /></div>
        <CardHeader className="relative z-10 pb-0">
          <CardTitle className="text-2xl flex items-center gap-2"><FileWarning className="text-secondary" /> AI Grant & Compliance Drafter</CardTitle>
          <CardDescription>Automate Federal & State Eligibility Reports for immediate compliance assessment.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Project Name</label>
                <Input placeholder="Miami SuperSeawall" value={projectName} onChange={e => setProjectName(e.target.value)} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Target Grant</label>
                <Select value={grantType} onValueChange={setGrantType}>
                  <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select Grant" /></SelectTrigger>
                  <SelectContent>
                    {grantTypes.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex justify-between">
                  <span>Funding Req (Millions)</span>
                </label>
                <Input type="number" step="0.5" placeholder="e.g. 15.5" value={fundingRequested} onChange={e => setFundingRequested(e.target.value)} />
             </div>
             <Button 
                onClick={handleGenerate} disabled={isLoading || !projectName || !fundingRequested}
                className="w-full h-10 hover:scale-[1.02] transition-transform"
             >
                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Drafting...</> : "Draft Initial Report"}
             </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <Card className="glass-card shadow-lg border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{result.reportTitle}</CardTitle>
                <CardDescription className="mt-1">Generated specifically for {grantType} regulations.</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Approval Probability</p>
                <div className="flex items-center gap-4">
                  <Progress value={result.eligibilityScore} className="w-32 h-3" />
                  <span className="text-2xl font-black text-primary">{result.eligibilityScore}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Executive Overview Draft</h4>
                  <p className="text-sm leading-relaxed text-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                    {result.executiveDraft}
                  </p>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Suggested Agency Partnerships</h4>
                    <div className="flex flex-wrap gap-2">
                       {result.suggestedPartners.map((partner, i) => (
                         <span key={i} className="text-xs font-medium px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary-foreground rounded-full">
                           {partner}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Compliance Checklist Status</h4>
                  <div className="space-y-3">
                    {result.complianceChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                         <span className="text-sm font-medium">{item.requirement}</span>
                         <div className="flex items-center gap-2 shadow-sm rounded-full px-2 py-0.5 bg-background">
                            {item.status === 'Met' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {item.status === 'At Risk' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            {item.status === 'Requires Revision' && <XCircle className="w-4 h-4 text-red-500" />}
                            <span className="text-xs font-bold">{item.status}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
