import type { BasePageProps } from '@/types/nextjs'

import { Filter } from '../../enum'
import PostFilter from '../PostFilter'

export default async function Page(props: BasePageProps) {
  const params = await props.params;
  const locale = params.locale

  return <PostFilter filter={Filter.recommand} locale={locale} />
}
