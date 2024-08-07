import type { Predicate, PredicateCast } from "@ark/schema"
import type { applyConstraint, Out, To } from "../ast.js"
import type { inferPipe } from "../intersect.js"
import type { inferTypeRoot, validateTypeRoot } from "../type.js"
import type { BaseType } from "./base.js"

// t can't be constrained to MorphAst here because it could be a union including some
// non-morph branches
/** @ts-ignore cast variance */
interface Type<out t = unknown, $ = {}> extends BaseType<t, $> {
	to<const def, r = inferTypeRoot<def, $>>(
		def: validateTypeRoot<def, $>
	): Type<inferPipe<t, r>, $>

	narrow<narrowed extends this["infer"] = never>(
		predicate: Predicate<this["infer"]> | PredicateCast<this["infer"], narrowed>
	): Type<
		(
			[narrowed] extends [never] ?
				applyConstraint<this["tOut"], "predicate", Predicate>
			:	narrowed
		) extends infer o ?
			this["tValidatedOut"] extends this["tOut"] ?
				(In: this["tIn"]) => To<o>
			:	(In: this["tIn"]) => Out<o>
		:	never,
		$
	>
}

export type { Type as MorphType }
