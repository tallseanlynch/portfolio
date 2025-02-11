import type { Meta, StoryObj } from '@storybook/react';
import { SnowShaderCanvas } from '../components';

const meta = {
  title: 'Shaders/Snow',
  component: SnowShaderCanvas,
} satisfies Meta<typeof SnowShaderCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shader: Story = {};