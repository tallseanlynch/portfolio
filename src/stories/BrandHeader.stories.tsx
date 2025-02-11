import type { Meta, StoryObj } from '@storybook/react';
import { BrandHeader } from '../components';
import { Provider } from 'react-redux';
import store from '../store';

const meta = {
  title: 'Brand/Header',
  component: BrandHeader,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ],
  argTypes: {
    brandHasBeenClicked: {
        control: 'boolean',
        default: true
    },
  },
} satisfies Meta<typeof BrandHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    brandHasBeenClicked: true
  },
};
