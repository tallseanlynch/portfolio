import type { Meta, StoryObj } from '@storybook/react';
import RomeShaderTextures from './RomeShaderTextures';

const meta = {
  title: 'Shaders/Rome/Textures',
  component: RomeShaderTextures,
} satisfies Meta<typeof RomeShaderTextures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Textures: Story = {};