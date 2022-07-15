import { Divider, Paper, Table, Title } from "@mantine/core";

export default function Index() {
    const rows: string[] = [];
    return (
        <Paper shadow="md" p="md" style={{ height: "88vh" }}>
            <Title order={1}>Clients</Title>
            <Divider my="md"></Divider>
            <Table>
                <tbody>{rows}</tbody>
            </Table>
        </Paper>
    );
}
