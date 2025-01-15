interface AuthContainerProps {
  title: string;
  children: React.ReactNode;
}

export function AuthContainer({ title, children }: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">BuildHub</h1>
          <h2 className="text-center text-xl font-semibold text-gray-700">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}