import type { Meta, StoryObj } from '@storybook/react';
import { WaterShaderCanvas } from '../components';

const meta = {
  title: 'Shaders/Water',
  component: WaterShaderCanvas,
} satisfies Meta<typeof WaterShaderCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shader: Story = {};
