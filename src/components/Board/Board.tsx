export type Task = {
    id: number
    title: string
    description: string
    column: string
}

function Board({ tasks }: { tasks: Task[] }) {
    return (
        <div>Board ({tasks.length})</div>
    )
}

export default Board