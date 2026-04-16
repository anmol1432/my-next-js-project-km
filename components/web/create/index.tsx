"use client"

import { createBlogSchema } from "@/app/schemas/blog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, PenSquare, Sparkles } from "lucide-react"
import React from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

type CreateBlogFormValues = z.infer<typeof createBlogSchema>

const TITLE_LIMIT = 100
const CONTENT_LIMIT = 5000

const CreateSection = () => {
  const form = useForm<CreateBlogFormValues>({
    resolver: zodResolver(createBlogSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  }) ?? ""
  const contentValue = useWatch({
    control: form.control,
    name: "content",
  }) ?? ""

  const onSubmit = form.handleSubmit(async () => {
    const toastId = toast.loading("Saving your draft...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      toast.success("Draft ready. Connect your save action next.", {
        id: toastId,
      })
      form.reset()
    } catch {
      toast.error("Something went wrong while preparing the draft.", {
        id: toastId,
      })
    }
  })

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.08),transparent_35%),linear-gradient(to_bottom,transparent,rgba(24,24,27,0.04))] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
            <PenSquare className="size-4" />
            New post workspace
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Write a post worth finishing
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Capture the headline, shape the story, and keep the draft clean
              with built-in validation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border/70 bg-background/95 shadow-lg shadow-black/5">
            <CardHeader>
              <CardTitle>Create post</CardTitle>
              <CardDescription>
                Add a strong title and enough context for the reader to follow
                the full idea.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="title">Title</Label>
                    <span className="text-xs text-muted-foreground">
                      {titleValue.length}/{TITLE_LIMIT}
                    </span>
                  </div>
                  <Input
                    id="title"
                    placeholder="Give your post a clear, specific headline"
                    aria-invalid={Boolean(form.formState.errors.title)}
                    {...form.register("title")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep it concise and descriptive.
                  </p>
                  <p className="min-h-5 text-sm text-destructive">
                    {form.formState.errors.title?.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="content">Content</Label>
                    <span className="text-xs text-muted-foreground">
                      {contentValue.length}/{CONTENT_LIMIT}
                    </span>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Write the body of your post here. Introduce the idea, expand with detail, and leave the reader with a clear takeaway."
                    className="min-h-72 resize-y"
                    aria-invalid={Boolean(form.formState.errors.content)}
                    {...form.register("content")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your schema requires at least 20 characters, so aim for a
                    meaningful first paragraph.
                  </p>
                  <p className="min-h-5 text-sm text-destructive">
                    {form.formState.errors.content?.message}
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    This screen is ready for backend wiring whenever you add the
                    submit action.
                  </p>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={form.formState.isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      {form.formState.isSubmitting
                        ? "Preparing..."
                        : "Create post"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70 bg-background/95 shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4" />
                  Writing cues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-lg border bg-muted/40 p-4">
                  Lead with one promise the post will deliver.
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  Break the content into short paragraphs for easier reading.
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  End with a takeaway, next step, or strong closing thought.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-background/95 shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4" />
                  Validation snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <span>Title length</span>
                  <span>5 to 100 chars</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <span>Content length</span>
                  <span>20 to 5000 chars</span>
                </div>
                <div className="rounded-lg border border-dashed px-4 py-3">
                  Submission is currently UI-only and can be connected to your
                  API or Convex mutation next.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateSection
