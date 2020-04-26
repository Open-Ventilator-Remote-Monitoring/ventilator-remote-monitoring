import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Select from 'react-select'

interface IProps {
  readonly className?: string
}

const wrapper: FunctionComponent<IProps> = ( {className, children} ) => (
  <div className={className}>
    {children}
  </div>
);

export const Error = styled(wrapper)`
  color: red;
  margin: 1.5rem 0 0 0;
  font-weight: bold;
`

export const RowSpread = styled(wrapper)`
  max-width: 1200px;
  margin: 1.5rem 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`

export const RowPack = styled(wrapper)`
  max-width: 1200px;
  margin: 1.5rem 0 0 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
`

export const StyledSelect = styled(Select)`
  min-width: 300px;
  max-width: 500px;
  margin-left: 30px;
`
