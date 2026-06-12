
    import {  Search,
  Mail,
  Link,
  ClipboardPaste,
} from "lucide-react"

function GmailStepsModal({
  email,
  alreadySent,
  onClose,
}: {
  email: string
  alreadySent: boolean
  onClose: () => void
}) {

const steps = [

  {
    icon: Search,
    title: "Find the email",
    desc:
      "Look for the Mango verification email in Inbox, Spam, or Promotions.",
  },

  {
    icon: Mail,
    title: "Open the email",
    desc:
      'Open the email: "Verify your Mango account".',
  },

  {
    icon: Link,
    title: "Verify your account",
    desc:
      "Click the verification button or link inside the email.",
  },

  {
    icon: ClipboardPaste,
    title: "Link not working?",
    desc:
      "Copy and paste the verification link into your browser.",
  },
]
  return (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 select-none"
  onClick={onClose}
>
  {/* Modal Card */}
  <div
    className="w-full max-w-md h-fit max-h-fit overflow-y-auto rounded-3xl border border-border bg-card text-card-foreground  px-4 py-2 shadow-sm backdrop-blur-md"
    style={{ background: "rgba(var(--card), 0.9)" }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header / Logo Section */}
    <div className="text-center mb-">
      {/* <div className="flex items-center justify-center mb-4">
        <div className="text-5xl animate-bounce-subtle">📧</div>
      </div> */}
      
      <h4
        className="text-xl! font-bold bg-clip-text text-transparent "
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--mango-orange), var(--star-bright))",
        }}
      >
        {alreadySent ? "Email already sent" : "Check your email"}
      </h4>
      
      <p className="text-sm! text-muted-foreground mt-3 select-none p-1">
        {alreadySent
          ? "A verification link was already sent to "
          : "We sent a verification link to "}
        <span
          className="font-semibold"
          style={{ color: "var(--mango-orange)" }}
        >
          {email}
        </span>
      </p>
      
      {alreadySent && (
        <p className="text-xs! text-muted-foreground my-2 italic">
          Please check your inbox — the link is still valid.
        </p>
      )}
    </div>

    {/* Steps / Instructions Section */}
    <div className="space-y-5 mb-3  ">
    {steps.map((step, index) => {
  const Icon = step.icon

  return (
    <div
      key={index}
      className="flex gap-4 rounded-2xl border border-border p-4"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mango-orange/10">
        <Icon className="h-5 w-5 text-mango-orange" />
      </div>

      <div>
        <h4 className="font-medium! text-sm!">{step.title}</h4>

        <p className="text-xs! text-muted-foreground">
          {step.desc}
        </p>
      </div>
    </div>
  )
})}
    </div>

    {/* Actions Section */}
    <div className="flex flex-col gap-3">
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-10 rounded-2xl flex items-center justify-center gap-3 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
        style={{ background: "var(--mango-orange)" }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.3 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.8-3.3-11.4-8l-6.5 5C9.4 39.4 16.1 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.3-6 6.8l6.3 5.2C39.5 36.3 44 30.7 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Open Gmail
      </a>

      <button
        onClick={onClose}
        className="w-full h-12 rounded-2xl text-sm font-medium border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
      >
        Got it
      </button>
    </div>
  </div>
</div>
  )
}

export default GmailStepsModal