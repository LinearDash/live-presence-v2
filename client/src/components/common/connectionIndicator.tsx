export default function ConnectionIndicator(isConnected: boolean) {
    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                    isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
            >
                <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                />
                {isConnected ? "Connected" : "Disconnected"}
            </div>
        </div>
    );
}