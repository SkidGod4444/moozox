import React from 'react'

export default function Policy() {
  return (
    <div className="bg-gradient-to-r from-background to-muted min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-primary-foreground mb-12">Privacy Policy</h1>
        <div className="space-y-6 text-secondary-foreground">
          <p className="mb-4">
            <strong className='text-primary'>1. Information Collection:</strong> We collect information you provide directly to us when using our service, including but not limited to account information and usage data.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>2. Use of Information:</strong> We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>3. Information Sharing:</strong> We do not sell or share your personal information with third parties except as described in this policy or with your consent.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>4. Data Security:</strong> We implement reasonable measures to help protect your information from unauthorized access, use, or disclosure.
          </p>
          <p className="mb-4">
            <strong className='text-primary'>5. Changes to Policy:</strong> We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
          <p className="mb-4 rounded-xl border p-3 bg-muted">
            <strong className='text-primary'>Disclaimer:</strong> This is a project for educational purposes. All rights and ownership of content remain with <b className='underline text-primary'>Jio Saavan</b>. We do not store or process any personal data beyond what is necessary for the functioning of this demo application.
          </p>
        </div>
      </div>
    </div>
  )
}
