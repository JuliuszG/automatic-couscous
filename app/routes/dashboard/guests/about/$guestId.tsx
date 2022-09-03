import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { fetchAboutGuestData } from "~/api/guests-api.services";

export const loader = async ({params, request}: any) => {
    const res = await fetchAboutGuestData(params.hotelId, request);
    const data = await res.json();
    return json(data)
};

const About = () => {
    const hotelData = useLoaderData();


    useEffect(()=>{
        console.log(hotelData);
    },[hotelData])

    return (
        <div>$guestId</div>
    )
}

export default About