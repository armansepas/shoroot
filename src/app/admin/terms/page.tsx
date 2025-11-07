"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, FileText } from "lucide-react";

interface TermsData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function TermsAdminPage() {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in as admin to access this page" });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/terms", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTerms(data);
        setContent(data.content);
      } else if (response.status === 404) {
        // No terms exist yet
        setTerms(null);
        setContent("");
      } else {
        setMessage({ type: "error", text: "Failed to fetch terms. Please ensure you're logged in as admin." });
      }
    } catch (error) {
      console.error("Failed to fetch terms:", error);
      setMessage({ type: "error", text: "Failed to fetch terms" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setMessage({ type: "error", text: "Terms content cannot be empty" });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in as admin to save terms" });
        return;
      }

      const method = terms ? "PUT" : "POST";
      const response = await fetch("/api/admin/terms", {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setTerms(data);
        setMessage({ type: "success", text: "Terms and conditions saved successfully" });
      } else if (response.status === 403) {
        setMessage({ type: "error", text: "Admin access required. Please login as admin." });
      } else {
        setMessage({ type: "error", text: "Failed to save terms and conditions" });
      }
    } catch (error) {
      console.error("Failed to save terms:", error);
      setMessage({ type: "error", text: "Failed to save terms and conditions" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Terms and Conditions Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage the terms and conditions that users must accept before participating in bets.
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms and Conditions Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="terms-content" className="block text-sm font-medium text-foreground mb-2">
                Content (supports Markdown formatting)
              </label>
              <Textarea
                id="terms-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your terms and conditions here..."
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use Markdown formatting for better readability. Common formatting includes **bold**, *italic*, and lists.
              </p>
            </div>

            {terms && (
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(terms.updatedAt).toLocaleString()}
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Terms
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {terms && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{terms.content}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}