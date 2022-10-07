import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Stack, Text, Title, ActionIcon, Divider, NumberInput, Select, Box, Paper } from '@mantine/core';
import { useForm, yupResolver } from "@mantine/form";
import { GuestsDto } from "~/dtos/guests/guests.dto";
import { DatePicker } from "@mantine/dates";
import If from "~/components/atoms/If/If";
import { IconTrash } from '@tabler/icons';
import { v4 as uuidv4 } from 'uuid';


type Tourist = {
    id?: string;
    lastName: string;
    firstName: string;
    age: number | null;
}
type CreateDto = {
    roomDetails: {
        roomNumber: number;
        floor: number;
        roomType: string;
        food: string;
        periodOfResidence: string;
    };
    periodOfStay: {
        arrivalAt: Date;
        departureAt: Date;
    };
    touristsDetails: {
        tourists: Tourist[];
    };
}
type LoaderProps = {
    request: Request,
    params: any
}
type ActionProps = {
    request: Request,
    params: any
}


const GuestsForm = () => {
    const fetcher = useFetcher();
    const guestData = useLoaderData<CreateDto>();
    const [touristsDetails, setTouristsDetails] = useState<Tourist[]>([])

    const form = useForm<GuestsDto>({
        // schema: yupResolver(schema),
        initialValues: {
            roomNumber: null,
            floor: null,
            roomType: '',
            food: '',
            periodOfResidence: null,
            arrivalAt: '',
            departureAt: '',
            lastName: '',
            firstName: '',
            age: null,
        },
    });

    const handleSubmit = (body: GuestsDto): void => {
        const touristsDetailsData = touristsDetails.length ? touristsDetails : {
            lastName: form.values.lastName,
            firstName: form.values.firstName,
            age: form.values.age,
        }
        const data = {
            roomDetails: {
                roomNumber: body.roomNumber,
                floor: body.floor,
                roomType: body.roomType,
                food: body.food,
                periodOfResidence: body.periodOfResidence,
            },
            periodOfStay: {
                arrivalAt: body.arrivalAt,
                departureAt: body.departureAt
            },
            touristsDetails: {
                tourists: touristsDetailsData
            },
        }
        fetcher.submit({ data: JSON.stringify(data) }, { method: "post" });
    };

    const handleAddMoreGuestsClick = () => {
        setTouristsDetails((prev: Tourist[]) => {
            return [
                ...prev,
                {
                    id: uuidv4(),
                    lastName: form.values.lastName,
                    firstName: form.values.firstName,
                    age: form.values.age,
                }
            ]
        })
        form.getInputProps('firstName').onChange('')
        form.getInputProps('lastName').onChange('')
        form.getInputProps('age').onChange(null)
    }

    const handleDeleteGuesClick = (id: string | undefined) => {
        setTouristsDetails(prev => prev.filter(item => item.id !== id))
    }

    const setFormValue = (): void => {
        let touristsDetailsValue: Tourist | null = null;

        if (guestData?.touristsDetails?.tourists?.length) {
            setTouristsDetails(guestData.touristsDetails.tourists)
            touristsDetailsValue = guestData.touristsDetails.tourists[guestData.touristsDetails.tourists.length - 1]
        }

        form.setValues({
            roomNumber: guestData?.roomDetails?.roomNumber ?? null,
            floor: guestData?.roomDetails?.floor ?? null,
            roomType: guestData?.roomDetails?.roomType ?? '',
            food: guestData?.roomDetails?.food ?? '',
            periodOfResidence: guestData?.roomDetails?.periodOfResidence ? +guestData.roomDetails.periodOfResidence : null,
            arrivalAt: guestData?.periodOfStay?.arrivalAt ? new Date(guestData.periodOfStay.arrivalAt) : '',
            departureAt: guestData?.periodOfStay?.departureAt ? new Date(guestData.periodOfStay.departureAt) : '',
            lastName: touristsDetailsValue?.lastName ?? '',
            firstName: touristsDetailsValue?.firstName ?? '',
            age: touristsDetailsValue?.age ?? null,
        })
    }
    
    useEffect(() => {
        guestData && setFormValue()
    }, [guestData])

    return (
        <fetcher.Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack>
                <Title order={3}>Guests Details</Title>
                <If query={touristsDetails.length}>
                    {touristsDetails.map((item, index) => {
                        return (
                            <Stack key={item.id}>
                                <Paper className="py-2 px-4 my-2">
                                    <Group className='w-full'>
                                        <Text>
                                            {index + 1}.
                                        </Text>
                                        <Box className="flex justify-between items-center grow">
                                            <Text>
                                                {item.firstName}{' '}{item.lastName}
                                            </Text>
                                            <Box className="flex justify-between items-center">
                                                <Text>
                                                    {item.age}
                                                </Text>
                                                <ActionIcon className="ml-2" variant="outline" color="red" onClick={() => handleDeleteGuesClick(item?.id)}>
                                                    <IconTrash />
                                                </ActionIcon>
                                            </Box>
                                        </Box>
                                    </Group>
                                </Paper>
                            </Stack>
                        )
                    })}
                </If>
                <TextInput
                    label="First name"
                    placeholder="Type guset first name"
                    {...form.getInputProps('firstName')}
                />
                <TextInput
                    label="Last name"
                    placeholder="Type guest last name"
                    {...form.getInputProps('lastName')}
                />
                <Select
                    label="Age"
                    placeholder="Choose age of guest"
                    data={[
                        { value: 'children', label: 'Children' },
                        { value: 'adault', label: 'Adault' },
                    ]}
                    {...form.getInputProps('age')}
                />
                <Button disabled={!form.values.firstName || !form.values.lastName} onClick={handleAddMoreGuestsClick}>Add another guest</Button>
                <Divider my="sm" />
                <Title order={3}>Room Details</Title>
                <NumberInput
                    placeholder="Type guest room number"
                    label="Room number"
                    {...form.getInputProps('roomNumber')}
                />
                <NumberInput
                    placeholder="Type guest Floor"
                    label="Floor"
                    {...form.getInputProps('floor')}
                />
                <TextInput
                    label="Food"
                    placeholder="np. icluded"
                    {...form.getInputProps('food')}
                />
                <NumberInput
                    placeholder="np. 7 wath mean 7 nights"
                    label="Period"
                    {...form.getInputProps('periodOfResidence')}
                />

                <Divider my="sm" />
                <Title order={3}>Arrival and Departure Details</Title>
                <DatePicker
                    label="Date of arrival"
                    placeholder="Date of arrival"
                    value="2016-06-22 19:10:25"
                    {...form.getInputProps('arrivalAt')}
                />
                <DatePicker
                    label="Departure date"
                    placeholder="Departure date"
                    {...form.getInputProps('departureAt')}
                />
            </Stack>
            <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
            </Group>

        </fetcher.Form>
    )
}

export default GuestsForm