type Props = {
    query: any,
    children: React.ReactNode;
}

const If = ({ query, children }: Props) => {
    if (!query) return null
    return (
        <div>{children}</div>
    )
}

export default If