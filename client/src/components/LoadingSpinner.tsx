const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 animate-fade-in">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
      <div className="absolute inset-2 rounded-full bg-brand-500/10" />
    </div>
    <p className="text-slate-400 text-sm font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
