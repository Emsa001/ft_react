import React from './react';
import { ReactRender } from './render';

import "./render/mount";
import "./render/props";
import "./render/update";

export * from './react';
export * from './render';
export * from './types';
export * from "./routes/component";

export default React;

ReactRender.reRender(null);