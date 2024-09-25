export default function IconWithBadge({ count, child }: { count: number, child: React.ReactNode }) {
    return (
        <div className="relative inline-block m-4">
            {child}
            {(
                <span className="absolute bottom-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none  bg-gray-100 rounded-full transform translate-x-1/2 translate-y-1/2">
                    {count}
                </span>
            )}
        </div>
    );
};

