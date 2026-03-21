import { SignIn } from '@clerk/react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-800/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-600/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TaskFlow</h1>
          <p className="text-slate-400 mt-2 text-sm">Collaborative task management, simplified</p>
        </div>

        {/* Clerk Card */}
        <SignIn
          appearance={{
            layout: {
              socialButtonsPlacement: 'top',
            },
            elements: {
              rootBox: 'w-full flex justify-center',
              card: 'w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-400',
              formFieldLabel: 'text-white',
              socialButtonsBlockButton:
                'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors rounded-xl',
              formFieldInput:
                'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 rounded-lg',
              formButtonPrimary:
                'bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors rounded-xl',
              footerActionLink: 'text-brand-400 hover:text-brand-300',
              footer: 'bg-slate-900 rounded-b-2xl border-t border-slate-800',
              footerAction: 'text-white-400',
              dividerLine: 'bg-slate-700',
              dividerText: 'text-slate-500',
            },
          }}
          fallbackRedirectUrl="/dashboard"
        />
      </motion.div>
    </div>
  )
}