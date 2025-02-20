import type { Meta, StoryObj } from '@storybook/react';
import { BrandLanding } from '../components/brand/BrandLanding';

const meta = {
  title: 'Brand/Landing',
  component: BrandLanding,
  argTypes: {
    brandHasBeenClicked: {
        control: 'boolean',
        default: false
    },
  },
} satisfies Meta<typeof BrandLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    brandHasBeenClicked: false
  },
};
