
import React from 'react';
import { Link } from 'react-router-dom';
export default function NextLink(props) {
  return <Link to={props.href} {...props} />;
}
