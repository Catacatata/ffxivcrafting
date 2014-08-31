
<button class='btn btn-default pull-right add-to-list' data-item-id='{{ $leve->item->id }}' data-item-name='{{{ $leve->item->name->term }}}' data-item-quantity='{{{ $leve->amount }}}' rel='tooltip' title='Add to Crafting List'>
	<i class='glyphicon glyphicon-shopping-cart'></i>
	<i class='glyphicon glyphicon-plus'></i>
</button>

<h2>{{ $leve->name }}</h2>
<p>
	<strong>Level:</strong> {{ $leve->level }}
	 &nbsp; 
	<strong>Rewards:</strong> {{ number_format($leve->xp) }} XP and {{ number_format($leve->gil) }} gil.
	@if($leve->triple)
	 &nbsp; 
	<strong>Triple Turnin</strong>
	@endif
</p>
<p>
	<strong>Requires:</strong> {{ $leve->amount }} x <a href='http://xivdb.com/?item/{{ $leve->item->id }}' target='_blank'>{{ $leve->item->name->term }}</a>
</p>
@if($leve->item->recipe)
<ul class='list-group'>
	<li class='list-group-item'>
		<strong>Recipe:</strong> 
		<a href='http://xivdb.com/?recipe/{{ $leve->item->recipe[0]->id }}' target='_blank'>{{ $leve->item->name->term }}</a>, <a href='/crafting/list?Item:::::{{ $leve->item->id }}'>View in crafting tool</a>
	</li>
	@foreach($leve->item->recipe[0]->reagents as $reagent)
	<li class='list-group-item'>
		<a href='http://xivdb.com/?item/{{ $reagent->id }}' target='_blank'>
			<img src='/img/items/nq/{{ $reagent->id }}.png' width='36' height='36' class='margin-right'><span class='name'>{{ $reagent->name->term }}</span>
		</a>
		x {{ $reagent->pivot->amount * $leve->amount }}
		@if($leve->amount > 1)
		total
		@endif
	</li>
	@endforeach
</ul>
@endif
<p>
	Calculations assume you're turning in HQ items for a total reward of <em>{{ number_format($leve->xp * 2) }} XP</em> <small>(and {{ number_format($leve->gil * 2) }} Gil)</small> per allotment.
</p>
<p>
	You will make a gil profit if you can obtain {{ $leve->amount * ($leve->triple ? 3 : 1) }} items for less than {{ number_format($leve->gil * 2) }} Gil; or {{ number_format(($leve->gil * 2) / ($leve->amount * ($leve->triple ? 3 : 1))) }} each.
</p>	

<table class='table table-bordered table-striped'>
	<thead>
		<tr>
			<th>Level</th>
			<th>Requires</th>
			<th>Turnins</th>
			<th>XP Overkill</th>
		</tr>
	</thead>
	<tbody>
		@foreach($chart as $row)
		<tr>
			<td class='text-center'>{{ number_format($row['level']) }}</td>
			<td class='text-center' rel='tooltip' title='{{ number_format($row['requires']) }} - {{ number_format($row['previous_overkill']) }}' data-container='body'>{{ number_format($row['requires'] - $row['previous_overkill']) }}</td>
			<td class='text-center'>{{ number_format($row['turnins']) }}</td>
			<td class='text-center'>{{ number_format($row['overkill']) }}</td>
		</tr>
		@endforeach
	</tbody>
</table>

@if(isset($vs))
<a href='/leve/breakdown/{{ $leve->id }}'>View this Leve solo</a>
@endif