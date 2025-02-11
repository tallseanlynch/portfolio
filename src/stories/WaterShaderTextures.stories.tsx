import type { Meta, StoryObj } from '@storybook/react';
import WaterShaderTextures from './WaterShaderTextures';

const meta = {
  title: 'Shaders/Water/Textures',
  component: WaterShaderTextures,
} satisfies Meta<typeof WaterShaderTextures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Textures: Story = {};