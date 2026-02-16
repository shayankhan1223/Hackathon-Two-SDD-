'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <strong>Last updated:</strong> February 16, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our Service,
              or communicate with us. This includes your email address and any tasks or data you input into the system.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use your information to provide, maintain, and improve our Service, including processing your tasks,
              sending you updates, and responding to your inquiries.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Storage and Security</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We implement appropriate security measures to protect your information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not share your personal information with third parties except as described in this policy or
              with your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have the right to access, update, or delete your personal information at any time. You can do this
              through your account settings or by contacting us directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Retention</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We retain your information as long as your account is active or as needed to provide you with our Service.
              We will delete your information upon request or when no longer needed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Cookies and Similar Technologies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may use cookies and similar technologies to enhance your experience with our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <Link href="mailto:privacy@example.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                privacy@example.com
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}