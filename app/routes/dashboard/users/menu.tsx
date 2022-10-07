import CustomTabs from "~/components/organism/CustomTabs"
import { useUserData } from "~/context/user-context"
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from "react";



const UserMenu = () => {
    const userData = useUserData()
    const tabs = useMemo(() => {
        return [
            {
                id: uuidv4(),
                title: 'Create ',
                // icon: <IconSquarePlus size={32} />,
                disabled: false,
                roles: ['admin'],
                path: 'users/create'
            },
            {
                id: uuidv4(),
                title: 'Edit ',
                // icon: <IconEdit size={32} />,
                disabled: false,
                roles: ['user'],
                path: `users/edit/${userData.id}`
            },
            {
                id: uuidv4(),
                title: 'About ',
                // icon: <IconInfoSquare size={32} />,
                disabled: false,
                roles: ['user'],
                path: `users/about/${userData.id}`
            },
            {
                id: uuidv4(),
                title: 'List',
                // icon: <IconList size={32} />,
                disabled: false,
                roles: ['admin'],
                path: 'users/list'
            },

        ]
    }, [userData])
    console.log(userData)
    return (
        <div>
            <CustomTabs userData={userData} tabs={tabs} />
        </div>
    )
}

export default UserMenu