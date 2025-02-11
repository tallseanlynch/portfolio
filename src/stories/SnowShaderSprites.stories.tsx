import type { Meta, StoryObj } from '@storybook/react';
import SnowShaderSprites from './SnowShaderSprites';

const meta = {
  title: 'Shaders/Snow/Sprites',
  component: SnowShaderSprites,
} satisfies Meta<typeof SnowShaderSprites>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sprites: Story = {};