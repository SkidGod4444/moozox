import React from 'react'

export default function Tos() {
  return (
    <div className="bg-gradient-to-r from-background to-muted min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-primary-foreground mb-12">Terms of Service</h1>
        <div className="space-y-6 text-secondary-foreground">
          <p className="mb-4">
            <strong className='text-primary'>1. Acceptance of Terms:</strong> By accessing or using our service, you agree to be bound by these Terms of Service.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>2. Use of Service:</strong> You agree to use our service only for lawful purposes and in accordance with these Terms. As we use the original content owned by <b className='underline text-primary'>Jio Saavan</b> we still don&apos;t promote any illegal activities. 
          </p>
          <p className="mb-4">
            <strong className='text-primary'>3. User Accounts:</strong> You are responsible for safeguarding the password you use to access the service and for any activities or actions under your password.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>4. Intellectual Property:</strong> The service and its original content, songs, and images are owned by <b className='underline text-primary'>Jio Saavan</b> and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>5. Changes to Terms:</strong> We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.
          </p>
          <p className="mb-4 rounded-xl border p-3 bg-muted">
            <strong className='text-primary'>Disclaimer:</strong> This is just a educational project and is not intended for commercial use or to infringe on any copyrights. All rights and ownership of content remain with <b className='underline text-primary'>Jio Saavan</b>.
          </p>
        </div>
      </div>
    </div>
  )
}
