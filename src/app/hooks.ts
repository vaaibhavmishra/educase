import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from './store';

/**
 * Typed versions of useDispatch and useSelector.
 * Use these throughout the app instead of the plain redux hooks.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
