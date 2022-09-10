import { useMemo } from "react"
import { Column, } from "react-table";
import { deleteHotelData, fetchHotelsList } from "~/api/hotel-api.services";
import { ActionFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CustomTable from "~/components/organism/CustomTable";
import { ActionIcon, Card, Divider, Group, Title } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons";
import { fetchGuestsList } from "~/api/guests-api.services";

type Col = {
  id: string,
  roomDetails: {
    roomNumber?: number;
    floor?: number;
    roomType?: string;
    food?: string;
    periodOfResidence?: string;
  };
  periodOfStay: {
    arrivalAt?: Date;
    departureAt?: Date;
  };
  touristsDetails: {
    tourists?: Tourist[];
  };
  actions?: null;
};

type Tourist = {
  lastName?: string;
  firstName?: string;
  age?: number | null;
}

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
  const res = await fetchGuestsList(page, limit, sortDirection as "ASC" | "DESC", sortCol, request);
  const data = await res.json();
  return json(data)
};

export const action: ActionFunction = async ({ request, params }: any) => {

  return null
};


const List = () => {
  const hotelData = useLoaderData();

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
        Header: 'Guest Details',
        columns: [
          {
            Header: 'First Name',
            accessor: value => value.touristsDetails?.tourists?.map((item) => {
              return <div>{item?.firstName ? item?.firstName : '-'}</div>
            }) ?? '-'
          },
          {
            Header: 'Last Name',
            accessor: value => value.touristsDetails?.tourists?.map((item) => {
              return <div>{item?.lastName ? item?.lastName : '-'}</div>
            }) ?? '-'
          },
        ]
      },
      {
        Header: 'Room Details',
        columns: [
          {
            Header: 'Room number',
            accessor: value => value?.roomDetails?.roomNumber ?? '-'
          },
          {
            Header: 'Food',
            accessor: value => value?.roomDetails?.food ?? '-'
          },
          {
            Header: 'Period Of Residence',
            accessor: value => value?.roomDetails?.periodOfResidence ?? '-'
          },
        ]
      },
      {
        Header: 'Period of stay',
        columns: [
          {
            Header: 'Arrival At',
            accessor: value => value?.periodOfStay.arrivalAt ?? '-'
          },
          {
            Header: 'Departure At',
            accessor: value => value?.periodOfStay.departureAt ?? '-'
          },
        ]
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({
          value: initialValue,
          row,
        }) => {

          const handleItemDelete = () => {
            // deleteHotelData(row.original.id).then(data => console.log(data)).catch(err => console.log(err))

          }

          return (
            <div className="flex justify-center">
              <Link to={`../about/${row.original.id}`} className="mr-2">
                <ActionIcon size="md" variant="outline" color='blue' >
                  <IconEye />
                </ActionIcon>
              </Link>
              <ActionIcon size="md" variant="outline" color='red' onClick={handleItemDelete}>
                <IconTrash />
              </ActionIcon>
            </div>

          )
        },
      },
    ],
    []
  )

  return (
    <>
      <Group >
        <Title order={1}>Guests</Title>
      </Group>
      <Divider my="sm" />
      <Card>
        {data && <CustomTable columns={columns} data={data} links={links} />}
      </Card>
    </>
  )

}

export default List