export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-blue-600">
          Welcome to FreeTutor
        </h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Connecting students with special needs to qualified volunteer tutors
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3 text-blue-500">
              For Students
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find qualified tutors who can help you excel in your studies
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Register as Student
            </button>
          </div>

          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3 text-green-500">
              For Tutors
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share your knowledge and make a difference in students' lives
            </p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Register as Tutor
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold mb-2">1. Register</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your account and upload verification documents
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-semibold mb-2">2. Get Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our team reviews your documents for approval
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold mb-2">3. Connect</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Students and tutors connect for meaningful learning
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
