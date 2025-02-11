import type { Meta, StoryObj } from '@storybook/react';
import { BrandSection } from '../components';
import { Provider } from 'react-redux';
import store from '../store';

const meta = {
  title: 'Brand/Section',
  component: BrandSection,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
} satisfies Meta<typeof BrandSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
