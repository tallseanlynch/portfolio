import type { Meta, StoryObj } from '@storybook/react';
import App from '../App';
import { Provider } from 'react-redux';
import store from '../store';

const meta = {
  title: 'App',
  component: App,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
