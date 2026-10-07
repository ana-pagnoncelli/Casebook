from httpx import AsyncClient

from casebook.domain.checklist_item import ChecklistItem
from casebook.mapping.checklist_item import apply_checklist_item, checklist_item_from_row
from casebook.persistence.checklist_item import ChecklistItemRow


def test_row_maps_to_domain_and_back() -> None:
    row = ChecklistItemRow(id=1, text="Buy milk", completed=False)

    item = checklist_item_from_row(row)

    assert item == ChecklistItem(id=1, text="Buy milk", completed=False)
    apply_checklist_item(row, item.model_copy(update={"text": "Buy oats", "completed": True}))
    assert row.id == 1
    assert row.text == "Buy oats"
    assert row.completed is True


async def test_add_item_and_list_it(client: AsyncClient) -> None:
    created = await client.post("/checklist-items", json={"text": "Buy milk"})
    listed = await client.get("/checklist-items")

    assert created.status_code == 201
    assert created.json() == {"id": 1, "text": "Buy milk", "completed": False}
    assert listed.status_code == 200
    assert listed.json() == [{"id": 1, "text": "Buy milk", "completed": False}]


async def test_update_item_text(client: AsyncClient) -> None:
    created = await client.post("/checklist-items", json={"text": "Buy milk"})
    updated = await client.patch(
        f"/checklist-items/{created.json()['id']}",
        json={"text": "Buy oats"},
    )

    assert updated.status_code == 200
    assert updated.json() == {"id": 1, "text": "Buy oats", "completed": False}


async def test_complete_item(client: AsyncClient) -> None:
    created = await client.post("/checklist-items", json={"text": "Buy milk"})
    completed = await client.post(f"/checklist-items/{created.json()['id']}/complete")

    assert completed.status_code == 200
    assert completed.json() == {"id": 1, "text": "Buy milk", "completed": True}


async def test_remove_item(client: AsyncClient) -> None:
    created = await client.post("/checklist-items", json={"text": "Buy milk"})
    removed = await client.delete(f"/checklist-items/{created.json()['id']}")
    listed = await client.get("/checklist-items")

    assert removed.status_code == 204
    assert listed.json() == []


async def test_missing_item_returns_404(client: AsyncClient) -> None:
    updated = await client.patch("/checklist-items/99", json={"text": "Buy oats"})
    completed = await client.post("/checklist-items/99/complete")
    removed = await client.delete("/checklist-items/99")

    assert updated.status_code == 404
    assert completed.status_code == 404
    assert removed.status_code == 404


async def test_empty_text_is_rejected(client: AsyncClient) -> None:
    created = await client.post("/checklist-items", json={"text": ""})
    updated = await client.patch("/checklist-items/1", json={"text": ""})

    assert created.status_code == 422
    assert updated.status_code == 422
