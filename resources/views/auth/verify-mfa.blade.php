<x-app-layout>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
        <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
            <h2 class="text-2xl font-bold text-center mb-6">Email Verification</h2>

            @if (session('message'))
                <div class="mb-4 text-sm text-green-600">
                    {{ session('message') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-4">
                    <div class="text-sm text-red-600">
                        {{ $errors->first() }}
                    </div>
                </div>
            @endif

            <form method="POST" action="{{ route('verify-mfa.verify') }}">
                @csrf

                <div class="mb-4">
                    <label for="verification_code" class="block text-sm font-medium text-gray-700">Verification Code</label>
                    <input type="text" name="verification_code" id="verification_code" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                           required autocomplete="off">
                </div>

                <div class="flex items-center justify-between mt-4">
                    <form method="POST" action="{{ route('verify-mfa.send') }}" class="inline">
                        @csrf
                        <button type="submit" class="text-sm text-gray-600 hover:text-gray-900">
                            Resend Code
                        </button>
                    </form>

                    <button type="submit" class="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                        Verify
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-app-layout>