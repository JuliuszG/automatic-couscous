import { useCallback, useMemo } from "react"
import { Column, } from "react-table";
import { deleteHotelData, fetchHotelsList } from "~/api/hotel-api.services";
import { ActionFunction, json } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import CustomTable from "~/components/organism/CustomTable";
import { ActionIcon, Card, Divider, Group, Title } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons";
import { fetchUsersList } from "~/api/user-api.services";

type Col = {
  id: string;
  email: string;
  role: string;
  actions?: null;
};

type Pagination = {
  first: string,
  last: string,
  next: string,
  previous: string,
}

type Loader = {
  request: Request
}

export const loader = async ({ request }: Loader) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || '1';
  const limit = url.searchParams.get("limit") || '10';
  const sortDirection = url.searchParams.get("sortDirection") || 'DESC';
  const sortCol = url.searchParams.get("sortCol") || 'id';
  const res = await fetchUsersList(page, limit, sortDirection as "ASC" | "DESC", sortCol, request);
  const data = await res.json();
  return json(data)
};

export const action: ActionFunction = async ({ request }: any) => {
  const formData = await request.formData();
  const values = JSON.parse(formData.get("data") as string);
  const deleteHotel = await deleteHotelData(values?.id, request)
  const res = deleteHotel.json()
  return loader({ request })
};

const UserList = () => {
  const userData = useLoaderData();
  const fetcher = useFetcher();

  console.log(userData)

  const data: Col[] = useMemo(
    () => userData?.items,
    [userData]
  )

  const links: Pagination = useMemo(
    () => userData?.meta,
    [userData]
  )

  const columns: Array<Column<Col>> = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({
          value: initialValue,
          row,
        }) => {

          const handleSubmit = () => {
            fetcher.submit({ data: JSON.stringify({ id: row.original.id }) }, { method: "delete" });
          }

          return (
            <div className="flex justify-center">
              <Link to={`../about/${row.original.id}`} className="mr-2">
                <ActionIcon size="md" variant="outline" color='blue' >
                  <IconEye />
                </ActionIcon>
              </Link>
              <fetcher.Form method="delete" onSubmit={() => handleSubmit()}>
                <input type="hidden" name="_method" value="delete" />
                <ActionIcon size="md" variant="outline" color='red' type="submit">
                  <IconTrash />
                </ActionIcon>
              </fetcher.Form>
            </div >

          )
        },
      },
    ],
    []
  )

  return (
    <>
      <Group >
        <Title order={1}>Users</Title>
      </Group>
      <Divider my="sm" />
      <Card>
        {data && <CustomTable columns={columns} data={data} links={links} />}
      </Card>
    </>
  )

}

export default UserList