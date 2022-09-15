

import { Tabs, Tab } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';

const CustomTabs = () => {
    return (
        <div style={{ position: "relative" }}>
        <Tabs variant="outline">
          <Tab label="First">First tab content</Tab>
          <Tab label="Second">Second tab content</Tab>
          <Tab label="Third">Third tab content</Tab>
        </Tabs>
      </div>
    );
}

export default CustomTabs;