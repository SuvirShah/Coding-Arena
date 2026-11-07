import { Component } from "react";

// After a new deploy the old hashed JS files disappear; a page that was lazy-loaded from the
// previous build then fails to import. A reload fetches the new build, so say that instead of "crashed".
const isChunkError = (error) =>
    /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError/i.test(
        `${error?.name || ""} ${error?.message || ""}`
    );

class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("UI crashed:", error, info?.componentStack);
    }

    componentDidUpdate(prevProps) {
        // Navigating somewhere else gives the user a fresh start
        if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ error: null });
        }
    }

    render() {
        const { error } = this.state;
        if (!error) return this.props.children;

        const stale = isChunkError(error);
        return (
            <div role="alert" className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-5 ring-1 ring-error/20 text-2xl font-bold">
                    !
                </div>
                <h1 className="text-2xl font-extrabold text-base-content">
                    {stale ? "A new version is available" : "Something went wrong"}
                </h1>
                <p className="text-base-content/60 mt-2 max-w-md">
                    {stale
                        ? "CodeArena was updated while this tab was open. Reload to get the latest version."
                        : "This page hit an unexpected error. You can try again, or head back to the problem list."}
                </p>
                <div className="flex gap-3 mt-6">
                    {stale ? (
                        <button className="btn btn-primary rounded-xl" onClick={() => window.location.reload()}>
                            Reload
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-primary rounded-xl" onClick={() => this.setState({ error: null })}>
                                Try again
                            </button>
                            <button className="btn btn-ghost rounded-xl" onClick={() => window.location.assign("/")}>
                                Go home
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;