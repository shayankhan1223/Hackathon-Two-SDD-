'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <strong>Last updated:</strong> February 16, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By accessing and using the AI-Powered Todo Chatbot ("Service"), you agree to be bound by these Terms of Service ("Terms").
              If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our Service allows users to manage tasks through an AI-powered chat interface. We provide tools for creating,
              organizing, and tracking tasks with intelligent assistance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you create an account with us, you must provide accurate and complete information. You are responsible
              for maintaining the security of your account and password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Data and Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
              and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Prohibited Uses</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree not to misuse the Service or help anyone else do so. This includes, but is not limited to:
              attempting to access, use, or share other users' information without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages
              arising out of your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any changes through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about these Terms, please contact us at{' '}
              <Link href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                support@example.com
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}