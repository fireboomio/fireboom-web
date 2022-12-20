/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'

import DatasourceContainer from '../components/Container'

export default function Datasource() {
  const { showType, content } = useContext(DatasourceToggleContext)
  return <DatasourceContainer showType={showType} content={content} />
}
