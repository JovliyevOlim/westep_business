import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button.tsx";

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    parameters: {
        design: {
            type: "figma",
            url: "https://www.figma.com/design/ywexjSFMquJzdidKL9KQx6/Projects?node-id=2367-129&t=S4hcN1XnKGgZ2evH-1" // bitta URL barcha story’lar uchun
        }
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["primary", "secondary", "danger"],
        },
        children: { control: "text" },
        isPending: { control: "boolean" },
    },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary", children: "Primary" ,isPending:false} };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" ,isPending:false} };
export const Danger: Story = { args: { variant: "danger", children: "Danger" ,isPending:false} };