import GetRoomId from "@/components/GetRoomId"

export default async function Canvas({
    params
}: {
    params: {
        slug: string
    }
}) {
    const { slug } = await params

    if(!slug){
        return <div>Invalid room name...</div>
    }

    return <GetRoomId slug={slug} />
}