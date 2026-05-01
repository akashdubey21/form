interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon = '📭', title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 animate-fade-in">
    <div className="text-5xl">{icon}</div>
    <div className="text-center">
      <h3 className="text-slate-200 font-semibold text-lg">{title}</h3>
      {description && <p className="text-slate-500 text-sm mt-1 max-w-sm">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
