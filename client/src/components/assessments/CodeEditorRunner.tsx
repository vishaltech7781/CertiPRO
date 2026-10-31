import React, { useState } from 'react';
import { CodingChallenge } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { Play, CheckCircle2, XCircle, Code, Shield, ShieldAlert } from 'lucide-react';

export interface CodeEditorRunnerProps {
  challenge: CodingChallenge;
  onSolutionAccepted?: () => void;
}

export const CodeEditorRunner: React.FC<CodeEditorRunnerProps> = ({
  challenge,
  onSolutionAccepted,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    challenge.supportedLanguages[0] || 'javascript'
  );

  const [code, setCode] = useState<string>(
    challenge.starterCode[selectedLanguage as keyof typeof challenge.starterCode] || ''
  );

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCode(challenge.starterCode[lang as keyof typeof challenge.starterCode] || '');
    setTestResult(null);
    setSubmissionResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleRunTests = async () => {
    setError(null);
    setSubmissionResult(null);
    try {
      setRunning(true);
      const res = await api.post(`/challenges/${challenge._id}/run`, {
        language: selectedLanguage,
        sourceCode: code,
      });

      if (res.success && res.data) {
        setTestResult(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run test cases.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      setSubmitting(true);
      const res = await api.post(`/challenges/${challenge._id}/submit`, {
        language: selectedLanguage,
        sourceCode: code,
      });

      if (res.success && res.data) {
        setSubmissionResult(res.data);
        if (res.data.status === 'Accepted' && onSolutionAccepted) {
          onSolutionAccepted();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit solution.');
    } finally {
      setSubmitting(false);
    }
  };

  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const triggerCopyNotice = () => {
    setCopyNotice('Copying assessment problem descriptions is disabled to uphold test integrity.');
    setTimeout(() => {
      setCopyNotice(null);
    }, 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-lg border border-surface-200 overflow-hidden shadow-sm">
      {/* Problem Description Panel with Anti-Copy/Paste */}
      <div
        className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-surface-200 space-y-5 overflow-y-auto max-h-[750px] select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onCopy={(e) => {
          e.preventDefault();
          triggerCopyNotice();
        }}
        onCut={(e) => {
          e.preventDefault();
          triggerCopyNotice();
        }}
        onPaste={(e) => {
          e.preventDefault();
          triggerCopyNotice();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          triggerCopyNotice();
        }}
        onDragStart={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="teal">{challenge.difficulty}</Badge>
              {challenge.topicTags.map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              <ShieldAlert className="w-3 h-3 text-amber-700" />
              <span>Copy Protected</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-ink-900">{challenge.title}</h2>
        </div>

        {copyNotice && (
          <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 rounded-md text-xs flex items-center justify-between">
            <span>⚠️ {copyNotice}</span>
            <button
              onClick={() => setCopyNotice(null)}
              className="text-red-700 hover:text-red-900 font-bold ml-2 text-sm leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="text-xs text-ink-700 leading-relaxed space-y-3">
          <p className="whitespace-pre-line">{challenge.problemStatement}</p>
        </div>

        {/* Input/Output format */}
        {(challenge.inputFormat || challenge.outputFormat) && (
          <div className="space-y-2 pt-2 border-t border-surface-100 text-xs">
            {challenge.inputFormat && (
              <div>
                <span className="font-semibold text-ink-900">Input Format: </span>
                <code className="text-brand-700 bg-surface-100 px-1 py-0.5 rounded font-mono">
                  {challenge.inputFormat}
                </code>
              </div>
            )}
            {challenge.outputFormat && (
              <div>
                <span className="font-semibold text-ink-900">Output Format: </span>
                <code className="text-brand-700 bg-surface-100 px-1 py-0.5 rounded font-mono">
                  {challenge.outputFormat}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Sample Test Cases */}
        <div className="space-y-3 pt-2 border-t border-surface-100">
          <h4 className="font-bold text-xs uppercase tracking-wider text-ink-900">
            Sample Test Cases
          </h4>
          {challenge.sampleTestCases.map((tc, idx) => (
            <div key={idx} className="bg-surface-50 p-3 rounded border border-surface-200 text-xs font-mono space-y-1">
              <div>
                <span className="text-surface-400 font-sans">Input: </span>
                <span className="text-ink-900 font-semibold">{tc.input}</span>
              </div>
              <div>
                <span className="text-surface-400 font-sans">Output: </span>
                <span className="text-emerald-700 font-semibold">{tc.expectedOutput}</span>
              </div>
              {tc.explanation && (
                <div className="text-[11px] text-ink-600 font-sans pt-1 border-t border-surface-200/50">
                  {tc.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-surface-400 pt-2 border-t border-surface-100">
          <Shield className="w-3.5 h-3.5 text-accent-600" />
          <span>Evaluated server-side in a secure sandboxed execution runner.</span>
        </div>
      </div>

      {/* Code Editor and Test Results Panel */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-surface-50">
        <div>
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-ink-900 text-white border-b border-ink-800">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-semibold">Solution Code</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="lang-select" className="text-[11px] text-surface-300">
                Language:
              </label>
              <select
                id="lang-select"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-ink-800 text-white text-xs px-2.5 py-1 rounded border border-ink-700 focus:outline-none"
              >
                {challenge.supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monospace Code Editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-80 p-4 font-mono text-xs text-ink-900 bg-white leading-relaxed resize-none focus:outline-none border-b border-surface-200"
              placeholder={`Write your ${selectedLanguage} solution here...`}
            />
          </div>
        </div>

        {/* Results & Actions Container */}
        <div className="p-4 space-y-4">
          {error && <Alert type="error">{error}</Alert>}

          {/* Sample Run Test Results */}
          {testResult && !submissionResult && (
            <div className="bg-white p-3.5 rounded border border-surface-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {testResult.status === 'Accepted' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  Sample Tests: {testResult.message}
                </span>
                <span className="font-mono text-[11px] text-surface-400">
                  Passed: {testResult.passed} / {testResult.total}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {testResult.details?.map((d: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-[11px] font-mono border ${
                      d.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div>Case {d.testCase}: {d.passed ? 'Passed' : 'Failed'}</div>
                    {d.actualOutput !== undefined && (
                      <div className="text-ink-600">
                        Actual: {d.actualOutput} | Expected: {d.expectedOutput}
                      </div>
                    )}
                    {d.error && <div className="text-red-700 font-sans">{d.error}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Result */}
          {submissionResult && (
            <div
              className={`p-4 rounded border text-xs ${
                submissionResult.status === 'Accepted'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {submissionResult.status === 'Accepted' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  Status: {submissionResult.status}
                </span>
                <span className="font-mono">
                  {submissionResult.passed} of {submissionResult.total} Test Cases Passed
                </span>
              </div>
              <p className="mt-1 text-xs">{submissionResult.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunTests}
              loading={running}
              disabled={submitting}
            >
              <Play className="w-3.5 h-3.5" /> Run Sample Tests
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleSubmit}
              loading={submitting}
              disabled={running}
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

