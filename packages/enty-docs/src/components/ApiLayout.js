// @flow
import React from 'react';
import MainLayout from '../components/MainLayout';

type Props = {};

export default function ApiLayout(props: Props) {
    return <MainLayout>{props.children}</MainLayout>;
}


