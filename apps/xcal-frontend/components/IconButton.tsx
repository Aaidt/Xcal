

export default function IconButton({
    icon,
    onClick,
    activated
}: {
    icon: React.ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div className={`rounded-md p-2 hover:bg-gray-900 duration-200 cursor-pointer 
        ${activated ? "text-red-300" : "text-white"}`} onClick={onClick}>
            {icon}
    </div>

}