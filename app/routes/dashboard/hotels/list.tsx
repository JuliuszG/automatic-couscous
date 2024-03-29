import { useCallback, useMemo } from "react"
import { Column, } from "react-table";
import { deleteHotelData, fetchHotelsList } from "~/api/hotel-api.services";
import { ActionFunction, json } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import CustomTable from "~/components/organism/CustomTable";
import { ActionIcon, Card, Divider, Group, Title } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons";

type Col = {
  description?: string;
  hotelImgId?: null;
  id: string;
  location?: number[];
  name: string;
  rating?: null;
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
  const res = await fetchHotelsList(page, limit, sortDirection as "ASC" | "DESC", sortCol, request);
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

const List = () => {
  const hotelData = useLoaderData();
  const fetcher = useFetcher();

  const data: Col[] = useMemo(
    () => hotelData?.items,
    [hotelData]
  )

  const links: Pagination = useMemo(
    () => hotelData?.meta,
    [hotelData]
  )

  const columns: Array<Column<Col>> = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Rating',
        accessor: 'rating',
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
        <Title order={1}>Hotels</Title>
      </Group>
      <Divider my="sm" />
      <Card>
        {data && <CustomTable columns={columns} data={data} links={links} />}
      </Card>
    </>
  )

}

export default List