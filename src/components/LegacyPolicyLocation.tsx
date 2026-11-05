"use client";
import {useEffect} from 'react';
/** Keep existing bookmarked policy fragments useful after splitting the page. */
export function LegacyPolicyLocation(){useEffect(()=>{const redirect=()=>{const hash=location.hash;if(/^#(?:policy|policy-sources|employment|policy-(?:source-)?(?:ai-action|employment|ai-education|skills))$/.test(hash))location.replace('/policies'+hash)};redirect();window.addEventListener('hashchange',redirect);return()=>window.removeEventListener('hashchange',redirect)},[]);return null}
